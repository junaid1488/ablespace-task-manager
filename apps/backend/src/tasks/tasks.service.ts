import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  TaskPriority,
  TaskStatus,
} from '../common/enums/task.enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  [TaskPriority.LOW]: 0,
  [TaskPriority.MEDIUM]: 1,
  [TaskPriority.HIGH]: 2,
};

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.TODO,
        priority: dto.priority ?? TaskPriority.MEDIUM,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        ownerId,
      },
    });
  }

  async findAll(ownerId: string, query: QueryTaskDto) {
    const {
      search,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: Prisma.TaskWhereInput = {
      ownerId,
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
            },
          },
          {
            description: {
              contains: search,
            },
          },
        ],
      }),
    };

    if (sortBy === 'priority') {
      const all = await this.prisma.task.findMany({
        where,
      });

      const sorted = all.sort((a, b) => {
        const aPriority = a.priority as TaskPriority;
        const bPriority = b.priority as TaskPriority;

        return sortOrder === 'asc'
          ? PRIORITY_WEIGHT[aPriority] -
              PRIORITY_WEIGHT[bPriority]
          : PRIORITY_WEIGHT[bPriority] -
              PRIORITY_WEIGHT[aPriority];
      });

      const start = (page - 1) * limit;

      return {
        data: sorted.slice(start, start + limit),
        meta: {
          total: sorted.length,
          page,
          limit,
          totalPages: Math.ceil(sorted.length / limit),
        },
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(ownerId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not own this task',
      );
    }

    return task;
  }

  async update(
    ownerId: string,
    id: string,
    dto: UpdateTaskDto,
  ) {
    await this.findOne(ownerId, id);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        ...dto,
        dueDate: dto.dueDate
          ? new Date(dto.dueDate)
          : undefined,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);

    await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      success: true,
    };
  }

  async stats(ownerId: string) {
    const [
      total,
      todo,
      inProgress,
      done,
      overdue,
    ] = await this.prisma.$transaction([
      this.prisma.task.count({
        where: {
          ownerId,
          deletedAt: null,
        },
      }),

      this.prisma.task.count({
        where: {
          ownerId,
          deletedAt: null,
          status: TaskStatus.TODO,
        },
      }),

      this.prisma.task.count({
        where: {
          ownerId,
          deletedAt: null,
          status: TaskStatus.IN_PROGRESS,
        },
      }),

      this.prisma.task.count({
        where: {
          ownerId,
          deletedAt: null,
          status: TaskStatus.DONE,
        },
      }),

      this.prisma.task.count({
        where: {
          ownerId,
          deletedAt: null,
          status: {
            not: TaskStatus.DONE,
          },
          dueDate: {
            lt: new Date(),
          },
        },
      }),
    ]);

    return {
      total,
      todo,
      inProgress,
      done,
      overdue,
    };
  }
}