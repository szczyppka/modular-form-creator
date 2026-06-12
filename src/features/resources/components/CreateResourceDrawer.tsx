import { memo, useCallback, useState } from 'react'
import { Button, Drawer } from '@/design-system'
import { CreateResourceForm } from './CreateResourceForm'

export const CreateResourceDrawer = memo(function CreateResourceDrawer() {
  const [isOpen, setIsOpen] = useState(false)

  const openDrawer = useCallback(() => setIsOpen(true), [])
  const closeDrawer = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <Button type="button" onClick={openDrawer}>
        Create resource
      </Button>
      <Drawer title="Create resource" isOpen={isOpen} onClose={closeDrawer}>
        {isOpen ? <CreateResourceForm /> : null}
      </Drawer>
    </>
  )
})
