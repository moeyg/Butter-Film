export default class ImportHTML {
  static async fetchHTML(url) {
    try {
      const response = await fetch(url);
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to fetch HTML: ${error}`);
    }
  }

  static async importHTML(target) {
    try {
      const html = await this.fetchHTML(
        `/assets/pages/components/${target}.html`
      );
      const element = document.querySelector(`.${target}`);

      if (element) {
        element.innerHTML = html;
        return;
      } else {
        throw new Error(`HTML element not found: ${target}`);
      }
    } catch (error) {
      throw new Error(`Failed to import page: ${error}`);
    }
  }
}
