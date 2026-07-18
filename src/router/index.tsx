
import { createBrowserRouter } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import { routes } from './routes';
import { HomePage } from '@/pages/HomePage';
import { BoardPage } from '@/pages/BoardPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: routes.boardPattern,
        element: <BoardPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);