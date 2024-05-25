import 'reflect-metadata';
import App from "./app";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    global.strapi = strapi as any;
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({strapi}) {
    new App(strapi);
  },

  /**
   * An asynchronous function that runs after the application
   */
  destroy(/*{ strapi }*/) {},
};
