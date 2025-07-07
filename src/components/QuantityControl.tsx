import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

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
    <InputGroup>
      <Button
        variant="outline-secondary"
        disabled={quantity <= min}
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
      >
        -
      </Button>
      <Form.Control
        type="number"
        min={min}
        max={max}
        value={delayedQuantity}
        onChange={(e) => setDelayedQuantity(e.target.value)}
        onBlur={() => onQuantityChange(Math.min(max, Math.max(min, parseInt(delayedQuantity) || 0)))}
        className="text-center border-secondary"
      />
      <Button
        variant="outline-secondary"
        disabled={quantity >= max}
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
      >
        +
      </Button>
    </InputGroup>
  );
}