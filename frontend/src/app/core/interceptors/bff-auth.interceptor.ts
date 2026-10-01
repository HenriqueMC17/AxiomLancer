import { HttpInterceptorFn } from '@angular/common/http';

/**
 * BFF Auth Interceptor
 * Injeta 'withCredentials: true' em todas as requisições para envio e recepção
 * automática dos cookies HttpOnly (SameSite=Strict) gerenciados pelo BFF Fastify.
 */
export const bffAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const secureReq = req.clone({
    withCredentials: true,
  });
  return next(secureReq);
};
