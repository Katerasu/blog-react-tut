import './App.css';
import Post from './Post.js';
import Header from './Header.js';
import {Route, Routes} from 'react-router-dom';
import Layout from './Layout.js';
import IndexPage from './pages/IndexPage.js';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import { UserContextProvider } from 'UserContext';
import CreatePost from 'pages/CreatePost';
import PostPage from 'pages/PostPage';
import EditPost from 'pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path={'/login'} element={<LoginPage />} />
        <Route path={'/register'} element={<RegisterPage />} />
        <Route path={'/create'} element={<CreatePost />} />
        <Route path={'/post/:id'} element={<PostPage />} />
        <Route path={'/edit/:id'} element={<EditPost />} />
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
