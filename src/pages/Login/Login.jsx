import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function fazerLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setErro("");

      await login(email, senha);

      navigate("/admin");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
      }}
    >
      <h2>Login Administrativo</h2>

      <form onSubmit={fazerLogin}>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e)=>setSenha(e.target.value)}
        />

        <br /><br />

        {erro && (
          <p style={{color:"red"}}>
            {erro}
          </p>
        )}

        <button disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </form>
    </div>
  );
}