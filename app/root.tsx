import {
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./tailwind.css?url";
import { LinksFunction } from "@remix-run/node";
import { useState } from 'react'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import {
  Bars3Icon,
  ClipboardDocumentListIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Signup', href: '/', icon: ClipboardDocumentListIcon, disabled: false },
]
const events = [
  { id: 1, name: 'Seed', href: '/events/seed', initial: 'S', current: false },
  { id: 2, name: 'Pre-Seed', href: '/events/pre-seed', initial: 'PS', current: false },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en" className="h-full bg-gray-900">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full relative">
        <div>
          <Transition show={sidebarOpen}>
            <Dialog className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
              <TransitionChild
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-900/80" />
              </TransitionChild>

              <div className="fixed inset-0 flex">
                <TransitionChild
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                    <TransitionChild
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                        </button>
                      </div>
                    </TransitionChild>
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                      <div className="flex h-16 shrink-0 items-center">
                        <img
                          className="h-8 w-auto"
                          src="https://www.startup-nights.ch/logo/startup-nights.png"
                          alt="Startup Nights"
                        />
                      </div>
                      <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {navigation.map((item) => (
                                <li key={item.name}>
                                  {!item.disabled && (
                                    <NavLink
                                      to={item.href}
                                      onClick={() => setSidebarOpen(false)}
                                      className={({ isActive, isPending }) => classNames(isActive || isPending
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                      )}
                                    >
                                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                      {item.name}
                                    </NavLink>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </li>
                          <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">Events</div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {events.map((event) => (
                                <li key={event.name}>
                                  <NavLink
                                    to={event.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive, isPending }) => classNames(
                                      isActive || isPending
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                                    )}
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                      {event.initial}
                                    </span>
                                    <span className="truncate">{event.name}</span>
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>

          {/* Static sidebar for desktop */}
          <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://www.startup-nights.ch/logo/startup-nights.png"
                  alt="Startup Nights"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          {!item.disabled && (
                            <NavLink
                              to={item.href}
                              className={({ isActive, isPending }) => classNames(
                                isActive || isPending
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                              )}
                            >
                              <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                              {item.name}
                            </NavLink>
                          )}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">Events</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {events.map((event) => (
                        <li key={event.name}>
                          <NavLink
                            to={event.href}
                            className={({ isActive, isPending }) => classNames(
                              isActive || isPending
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                            )}
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                              {event.initial}
                            </span>
                            <span className="truncate">{event.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <div className="xl:pl-72">
            <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
              <button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div>
            {children}
            <ScrollRestoration />
            <Scripts />
          </div>
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

