
import 'reflect-metadata';
import {diContainer} from "../di-container";


/**
 * @Decorator
 * Define injectable decorator to mark a class as injectable
 * @returns {Function}
 */
export function Injectable(): Function {
  return function (target: any) {
    Reflect.defineMetadata('injectable', true, target);
  };
}

/**
 * @Decorator
 * Define inject decorator to mark a class as injectable
 * @param token
 * @returns {Function}
 */
export function Inject(token: any): Function {
  return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
    const existingInjectedTokens = Reflect.getMetadata('injectedTokens', target) || [];
    existingInjectedTokens.push({ token, parameterIndex });
    Reflect.defineMetadata('injectedTokens', existingInjectedTokens, target);
  };
}

// Définir la fonction inject
export function inject<T>(token: new (...args: any[]) => T): T {
  return diContainer.get(token);
}
