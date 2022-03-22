import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';

import illustrationImg from '../../assets/images/illustration.svg';
import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';
import Loading from '../../components/Loading';

import { Button } from '../../components/Button/index';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import '../../assets/styles/auth.scss';

export function Home() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user, singInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await singInWithGoogle();
    }
    history.push('rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed');
      return;
    }

    history.push(`/rooms/${roomCode}`);
    setLoading(false);
  }

  if (loading) return <Loading title="Aguarde! Conectando a Sala..." />;
  return (
    <>
      <div id="page-auth">
        <aside>
          <img
            src={illustrationImg}
            alt="Ilustração simbolizando perguntas e respostas"
          />
          <strong>Criar salas de Q&amp;A ao-vivo</strong>
          <p>Tire as dúvidas da sua audiência em tempo-real</p>
        </aside>
        <main>
          <div className="main-content">
            <img src={logoImg} alt="Letmeask" />
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleIconImg} alt="" />
              Crie sua sala como Google
            </button>
            <div className="separator">ou entre em uma sala</div>
            <form onSubmit={handleJoinRoom}>
              <input
                type="text"
                placeholder="Digite o código da sala"
                onChange={(event) => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type="submit"> Entrar na sala</Button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
