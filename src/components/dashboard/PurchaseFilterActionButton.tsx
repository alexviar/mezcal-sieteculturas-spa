import { PurchaseFilter } from "@/api/services/purchaseApi"
import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { FaFilter } from "react-icons/fa"

type Props = {
  defaultValues: PurchaseFilter
  onFilter(filter: PurchaseFilter): void
}

export const PurchaseFilterActionButton = ({ defaultValues, onFilter }: Props) => {
  const [show, setShow] = useState(false)
  const {
    handleSubmit,
    register,
    reset
  } = useForm({
    defaultValues
  })

  return <>
    <Button onClick={() => setShow(true)} style={{ aspectRatio: 1, width: 36, padding: 0 }}>
      <FaFilter />
    </Button>
    <Modal show={show} centered onHide={() => {
      setShow(false)
      reset()
    }}>
      <Modal.Header closeButton className="h5">Opciones de búsqueda</Modal.Header>
      <Form onSubmit={handleSubmit((values) => {
        reset(values)
        onFilter(values)
        setShow(false)
      })}>
        <Modal.Body>
          <fieldset>
            <legend className="fs-6">Estado del pedido</legend>
            <Form.Check
              {...register('status')}
              id='pending'
              type='radio'
              value='1'
              label='Pendiente'
            />
            <Form.Check
              {...register('status')}
              id='shipped'
              type='radio'
              value='2'
              label='Enviado'
            />
            <Form.Check
              {...register('status')}
              id='all'
              type='radio'
              value=''
              label='Todos'
            />
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button type='submit'>Filtrar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  </>
}