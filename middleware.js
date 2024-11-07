import { NextResponse } from 'next/server';

export function middleware(req) {
  const isAuth = req.cookies.get('isAuth'); // Получаем токен из cookies

  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', req.url)); // Абсолютный URL
  }

  return NextResponse.next(); // Если токен присутствует, продолжаем
}

export const config = {
  matcher: ['/users', '/tasks'], // маршруты, к которым применяется middleware
};
