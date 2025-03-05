import React from "react";

const EmailTemplate = () => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
        <h1 style={{fontSize:"42px",fontWeight:"bold"}}>Urosfera S.p.a</h1>
      <p style={{ fontSize: "16px", lineHeight: "26px", margin: "16px 0" }}>
        Gracias por registrarte con nosotros.
      </p>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <a
          href="https://ordenmedica.digital/registro" // Cambia por la URL correcta
          style={{
            backgroundColor: "#5F51E8",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "3px",
            textDecoration: "none",
            fontSize: "16px",
            display: "inline-block",
          }}
        >
          Empieza ahora
        </a>
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #eaeaea" }} />
      <p
        style={{ fontSize: "12px", lineHeight: "24px", color: "#8898aa", textAlign: "center" }}
      >
        Urosfera S.p.A
      </p>
    </div>
  );
};

export default EmailTemplate;