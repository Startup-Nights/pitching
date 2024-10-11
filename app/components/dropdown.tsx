import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Dropdown({ question, answer }: any) {
  return (
    <Disclosure as="div" className="p-6 bg-slate-800 rounded-xl transition" defaultOpen={false}>
      <DisclosureButton className="group flex w-full items-center justify-between text-left">
        <span className="text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
          {question}
        </span>
        <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel
        transition
        className="mt-2 text-sm/5 text-gray-400 leading-6 transition"
      >
        {answer}
      </DisclosurePanel>
    </Disclosure>
  )
}
