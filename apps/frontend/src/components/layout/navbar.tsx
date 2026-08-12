'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Check,
} from 'lucide-react';

import { ThemeToggle } from './theme-toggle';
import { useAuthStore } from '@/store/auth-store';

const AVATAR_COLORS = [
  'bg-orange-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-pink-500',
];

function avatarColor(name: string) {
  const idx =
    name.charCodeAt(0) % AVATAR_COLORS.length;

  return AVATAR_COLORS[idx];
}

export function Navbar({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const user = useAuthStore((state) => state.user);

  const name = user?.name ?? 'Guest';
  const email = user?.email ?? '';

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  const toggleNotifications = () => {
    setNotificationOpen((current) => !current);
    setProfileOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen((current) => !current);
    setNotificationOpen(false);
  };

  return (
    <header className="relative flex h-[68px] items-center justify-between border-b border-slate-800 bg-[#0b0f17] px-6">
      {/* Welcome section */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}

        <div>
          <p className="text-sm text-slate-400">
            Welcome back
          </p>

          <h1 className="text-base font-semibold text-white">
            {name}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Theme */}
        <ThemeToggle />

        {/* Notifications */}
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={toggleNotifications}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition ${
              notificationOpen
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <Bell size={21} />

            {/* Notification indicator */}
            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#0b0f17]" />
          </button>

          {/* Notification dropdown */}
          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-700 bg-[#111722] shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Notifications
                  </h2>

                  <p className="text-xs text-slate-400">
                    Your latest updates
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs text-blue-400 transition hover:text-blue-300"
                  onClick={() => {
                    // Mark all notifications as read
                  }}
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                <div className="flex gap-3 border-b border-slate-800 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <Bell size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Welcome to AbleSpace
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Your task manager is ready to use.
                    </p>

                    <p className="mt-2 text-[11px] text-slate-500">
                      Just now
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 px-4 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <Check size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Everything is up to date
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      No new task notifications.
                    </p>

                    <p className="mt-2 text-[11px] text-slate-500">
                      Today
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div
          ref={profileRef}
          className="relative"
        >
          <button
            type="button"
            onClick={toggleProfile}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white transition ${
              avatarColor(name)
            } ${
              profileOpen
                ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#0b0f17]'
                : 'hover:ring-2 hover:ring-slate-600'
            }`}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
          >
            {name.charAt(0).toUpperCase()}
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-slate-700 bg-[#111722] shadow-2xl">
              {/* User information */}
              <div className="border-b border-slate-700 px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(
                      name,
                    )}`}
                  >
                    {name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {name}
                    </p>

                    {email && (
                      <p className="truncate text-xs text-slate-400">
                        {email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <User size={17} />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Settings size={17} />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-700 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    // Logout can be connected to auth-store
                    // once the store logout method is confirmed.
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut size={17} />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}