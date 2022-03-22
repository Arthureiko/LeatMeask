import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import deleteImg from '../../assets/images/delete.svg';
import answerImg from '../../assets/images/answer.svg';
import checkImg from '../../assets/images/check.svg';
import logoImg from '../../assets/images/coca-logo.svg';
import Loading from '../../components/Loading';

import { Button } from '../../components/Button/index';
import { Question } from '../../components/Question';
import { RoomCode } from '../../components/RoomCode/index';
// import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import '../../assets/styles/room.scss';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const [loading, setLoading] = useState(false);
  const [loadings, setLoadings] = useState(false);

  const roomId = params.id;
  const { title, questions } = useRoom(roomId);

  async function handleEndRoom() {
    setLoading(true);
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });
    history.push('/');
    setLoading(false);
  }
  if (loading) return <Loading title="Encerrando a Sala..." />;

  async function handleDeleteQuestion(questionId: string) {
    setLoadings(true);
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
    setLoadings(false);
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  if (loadings) return <Loading title="Excluindo pergunta..." />;

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutline onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala - {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img
                        src={checkImg}
                        alt="Marcar Pergunta Como Respondida"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar Destaque à Pergunta" />
                    </button>
                  </>
                )}
                <button
                  className="bnt"
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover Pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
}
