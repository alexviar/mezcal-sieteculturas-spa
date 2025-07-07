import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaMinus, FaPlus } from "react-icons/fa";

interface QuantityControlsProps {
  quantity: number;
  min: number;
  max: number;
  onQuantityChange: (newQuantity: number) => void;
}

export const QuantityControls = ({ quantity, min, max, onQuantityChange }: QuantityControlsProps) => {
  const [delayedQuantity, setDelayedQuantity] = useState(String(quantity))
  useEffect(() => {
    setDelayedQuantity(String(quantity))
  }, [quantity])

  return (
    <InputGroup className="border rounded-pill overflow-hidden" style={{ width: 'auto' }}>
      <Button
        variant="outline-primary"
        className="border-0"
        disabled={quantity <= min}
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
      >
        <FaMinus size="0.875rem" className="mt-n1" />
      </Button>
      <Form.Control
        type="number"
        min={min}
        max={max}
        value={delayedQuantity}
        onChange={(e) => setDelayedQuantity(e.target.value)}
        onBlur={() => onQuantityChange(Math.min(max, Math.max(min, parseInt(delayedQuantity) || 0)))}
        className="text-center border-0"
        style={{ maxWidth: '8rem' }}
      />
      <Button
        variant="outline-primary"
        className="border-0"
        disabled={quantity >= max}
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
      >
        <FaPlus size="0.875rem" className="mt-n1" />
      </Button>
    </InputGroup>
  );
}