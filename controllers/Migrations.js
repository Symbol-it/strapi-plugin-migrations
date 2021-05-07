module.exports = {
  async getMigrationsInformations(ctx) {

    const version = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'migrations',
        key: 'version',
      })
      .get();

    ctx.send({ version });
  }
}