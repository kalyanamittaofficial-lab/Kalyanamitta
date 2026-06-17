import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import Words from './pages/Words';
import Sermons from './pages/Sermons';
import Path from './pages/Path';
import Life from './pages/Life';
import Community from './pages/Community';
import Profile from './pages/Profile';
import DharmaDhana from './pages/DharmaDhana';
import BookReader from './components/BookReader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="words" element={<Words />} />
          <Route path="sermons" element={<Sermons />} />
          <Route path="meditation" element={<Meditation />} />
          <Route path="path" element={<Path />} />
          <Route path="life" element={<Life />} />
          <Route path="community" element={<Community />} />
          <Route path="dharmadhana" element={<DharmaDhana />} />
          <Route path="profile" element={<Profile />} />
          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Route>
        {/* Book Reader is outside the Layout so it can be truly full-screen and immersive without the main header/footer */}
        <Route path="/read/:bookId" element={<BookReader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
