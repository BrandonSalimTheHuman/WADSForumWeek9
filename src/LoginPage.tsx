import './App.css';
import LoginArea from './assets/components/LoginArea';
import Title from './assets/components/Title';

const LoginPage = () => {
  return (
    <>
      <div className='space-above-title'></div>
      <Title />
      <LoginArea />
    </>
  );
};

export default LoginPage;
