'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import Dropdown from './dropdown'

export default function Example({ open, setOpen, startup }: any) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 shadow-4xl">
          <DialogPanel
            transition={true}
            className="relative transform overflow-hidden rounded-lg bg-gray-600 px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95 w-full max-w-2xl"
          >
            <div>
              <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-100">
                {startup.company}
              </DialogTitle>
              <div className="mt-2 text-gray-200">
                <ul className='list-disc ml-4 text-sm mt-4 mt-4'>
                  <li>Currently raising funds: {startup.funding}</li>
                  <li>Already pitched to investors: {startup.pitching}</li>
                </ul>
              </div>
            </div>
            <div className='mt-4 space-y-2'>
              <Dropdown question={'What problem do you address?'} answer={startup.problem_description} />
              <Dropdown question={'How do you solve this problem?'} answer={startup.problem_solution} />
              <Dropdown question={'What is unique about your problem-solving approach?'} answer={startup.problem_approach} />
              <Dropdown question={'Who is your user and who is your paying customer?'} answer={startup.userbase} />
              <Dropdown question={'What is your current revenue to date? If none, how do you plan to make money?'} answer={startup.revenue} />
              <Dropdown question={'What is your competitive advantage?'} answer={startup.advantage} />
              <Dropdown question={'If you won USD 1 Mio., how would you spend it?'} answer={startup.money_usage} />
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
