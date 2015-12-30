import './intro.css';
import logoImage from '../../../assets/img/logo/logo_color_2x.png';

class IntroController {
  constructor() {
    this.logoImage = logoImage;
    this.title = 'Intro Page';
  }

  setTitle(title) {
    this.title = title;
  }
}

IntroController.$inject = [];

export default IntroController;
