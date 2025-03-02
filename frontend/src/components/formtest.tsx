import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { courseSchema, groupSchema } from '@/validation/schemas/course.schema'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ColorPicker from './ColorPicker'

export default function CourseFormDialog() {
  const [selectedColor, setSelectedColor] = useState('bg-red-500')
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [groups, setGroups] = useState<string[]>([])
  const [groupError, setGroupError] = useState(false)

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseName: '',
    },
  })

  const groupForm = useForm<z.infer<typeof groupSchema>>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: '',
    },
  })

  const handleSaveGroup = (values: z.infer<typeof groupSchema>) => {
    setGroups([...groups, values.groupName])
    setGroupError(false)
    groupForm.reset()
    setGroupDialogOpen(false)
  }

  function onSubmit(values: z.infer<typeof courseSchema>) {
    // Validate that at least one group has been added
    if (groups.length === 0) {
      setGroupError(true)
      return
    }

    console.log({
      ...values,
      color: selectedColor,
      groups: groups,
    })
    form.reset()
    setGroups([])
    setIsMainDialogOpen(false)
    setSelectedColor('bg-red-500')
    setGroupError(false)
  }

  return (
    <>
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsMainDialogOpen(true)}>Add Course</Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Add a new course to your schedule.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='courseName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Course Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ColorPicker onChange={setSelectedColor} />
              {/* Group Section */}
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <FormLabel>Groups</FormLabel>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setGroupDialogOpen(true)}
                  >
                    Add Group
                  </Button>
                </div>

                {/* Added Groups list*/}
                {groups.length > 0 ? (
                  <div className='border rounded-md p-2'>
                    <ul>
                      {groups.map((group, index) => (
                        <li key={index} className='py-1'>
                          {group}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className='text-sm text-gray-500 italic'>
                    No groups added yet
                  </div>
                )}

                {/* Group validation error */}
                {groupError && (
                  <Alert variant='destructive' className='mt-2'>
                    <AlertDescription className='text-sm'>
                      At least one group must be added
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button type='submit'>Save Course</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Group Dialog */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add Group</DialogTitle>
            <DialogDescription>
              Add a new group to this course
            </DialogDescription>
          </DialogHeader>

          <Form {...groupForm}>
            <form
              onSubmit={groupForm.handleSubmit(handleSaveGroup)}
              className='space-y-4'
            >
              <FormField
                control={groupForm.control}
                name='groupName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Group Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type='submit'>Save Group</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
