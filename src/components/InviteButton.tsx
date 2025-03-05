"use client";
import { Button, Column, Dialog, Input, Toast } from "@/once-ui/components";
import { useState } from "react";

export default function InviteButton() {
  const [show, setShow] = useState(false);
  const [email,setEmail] = useState("")
  const [toast,setToast] = useState(false)

  const handleInvite = () => {
    fetch("/api/invite",{
        method:"POST",
        body:JSON.stringify({email}),
        headers: {
            "Content-Type":"application/json"
        }
    }).then(()=>{
        setShow(false)
        setToast(true)
  })
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setShow(true)}>
        Invitar laboratorio
      </Button>
      <Dialog
        onClose={() => setShow(false)}
        isOpen={show}
        title="Invitar laboratorio"
        description="Usa un correo para invitar a un laboratorio para su registro."
      >
        <Column gap="16">
          <Input value={email} onChange={e=>setEmail(e.target.value)} label="Correo" id="email" type="email" />
          <Button onClick={handleInvite} variant="primary">Enviar</Button>
        </Column>
      </Dialog>
      <Dialog title="Exito" onClose={()=>setToast(false)} description="" isOpen={toast}>
        <Toast variant="success">Invitación enviada</Toast>
      </Dialog>
    </>
  );
}
