import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useForm, SubmitHandler } from "react-hook-form";
import { setUser } from "@/models/redux/user";
import { useLoginMutation } from "@/api/services/authApi";
import { getErrorMessage } from "@/api/getErrorMessage";
import { toast } from "react-toastify";
import Loader from "./loader";
import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [login, loginState] = useLoginMutation()
  const dispatch = useDispatch();
  const router = useRouter();
  const { formState, register, handleSubmit, reset } = useForm<LoginFormInputs>();
  const redirectTo = router.query?.return as string ?? "/dashboard/home"

  const onSubmitLogin: SubmitHandler<LoginFormInputs> = async (credentials) => {
    try {
      const response = await login(credentials).unwrap();
      toast.success("Inicio de sesión exitoso");
      dispatch(
        setUser(response)
      );
      reset();
      router.replace(redirectTo);
    } catch (error) {
      toast.error("Error al iniciar sesión: " + getErrorMessage(error as any));
    }
  };

  useEffect(()=>{
    router.prefetch(redirectTo)
  }, [router])

  if(loginState.isSuccess) return null
  
  return (
    <Form className="login-form" onSubmit={handleSubmit(onSubmitLogin)}>
      <h1 className="text-center">Login</h1>
      {loginState.isLoading && <Loader message="Iniciando sesión..." />}
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          {...register("email", { required: "Este campo es requerido." })}
          type="text"
          placeholder=" "
          autoComplete="off"
          isInvalid={!!formState.errors.email}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.email?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          {...register("password", { required: "Este campo es requerido." })}
          type="password"
          placeholder=" "
          autoComplete="off"
          isInvalid={!!formState.errors.password}
        />
        <Form.Control.Feedback type="invalid">{formState.errors.password?.message}</Form.Control.Feedback>
      </Form.Group>
      <Button type="submit" className="w-100" disabled={loginState.isLoading}>
        Login
      </Button>
    </Form>
  );
}
