class DIContainer {
  private services = new Map();

  register<T>(token: new (...args: any[]) => T, instance: T): void {
    this.services.set(token, instance);
  }

  get<T>(token: new (...args: any[]) => T): T {
    const existingService = this.services.get(token);
    if (existingService) {
      return existingService;
    }

    if (Reflect.getMetadata('injectable', token)) {
      const instance = new token();
      this.services.set(token, instance);
      return instance;
    }

    throw new Error(`Service ${token.name} not found`);
  }
}

export const diContainer = new DIContainer();
