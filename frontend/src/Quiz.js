import React, { useEffect, useState } from 'react';
import sampleQuestions from './question.js'; 
import './Quiz.css';

export default function Quiz() {
  const [currQues, setCurrQues] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(interval);
        handleAnswer(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQues = currQues + 1; 
    if (nextQues < sampleQuestions.length) {
      setCurrQues(nextQues);
      setTimer(30);
    } else {
      setShowScore(true);
    }
  };

  const handlePrevious = () => {
    if (currQues > 0) {
      setCurrQues(currQues - 1);
      setTimer(30);
    }
  };

  const handleNext = () => {
    const nextQues = currQues + 1;
    if (nextQues < sampleQuestions.length) {
      setCurrQues(nextQues);
      setTimer(30);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className='container'>
      <h1 className='text'>Simple Quiz App with Timer</h1>
      {showScore ? (
        <div>
          <h2 className='res'>Your Score {score} out of {sampleQuestions.length}</h2>
        </div>
      ) : (
        <div>
          <div className='timer'>Time Left: {timer}</div>
          <div className='disQues'>
            <div className='ques'>
              <div className='ques-text'>
                Question {currQues + 1} of {sampleQuestions.length}: {sampleQuestions[currQues].questionText}
              </div>
            </div>
            <div className='ans'>
              {sampleQuestions[currQues].options.map((opt, idx) => (
                <button key={idx} onClick={() => handleAnswer(opt.isCorrect)} className='btn'>
                  {opt.answer}
                </button>
              ))}
            </div>
          </div>
          <div className='navigation'>
            <button onClick={handlePrevious} className='btn nav-btn' disabled={currQues === 0}>
              Previous
            </button>
            <button onClick={handleNext} className='btn nav-btn' disabled={currQues === sampleQuestions.length - 1}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
