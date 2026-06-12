import { useState } from 'react'
import { Button, Drawer } from '@/design-system'
import { CreateResourceForm } from './CreateResourceForm'

export function CreateResourceAction() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Create resource
      </Button>

      <Drawer title="Create resource" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {isOpen ? <CreateResourceForm /> : null}
      </Drawer>
    </>
  )
}
