import { useModal } from "@/models/context/useModal";
import { Modal as BsModal} from "react-bootstrap";

export default function Modal({header}:{header: string}) {
  const { open, setOpen, content } = useModal();
  return (
    <BsModal show={open} centered size="xl" onHide={() => setOpen(false)}>
      <BsModal.Header closeButton>{header}</BsModal.Header>
      <BsModal.Body>
        {content}
      </BsModal.Body>
    </BsModal>
  );
}
