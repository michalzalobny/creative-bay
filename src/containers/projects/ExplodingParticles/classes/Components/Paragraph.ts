// import SplitType from 'split-type';

// interface Constructor {
//   element: HTMLElement;
// }

// export class Paragraph {
//   _text: SplitType;

//   constructor({ element }: Constructor) {
//     super({ element });

//     this._text = new SplitType(this._element, {
//       tagName: 'span',
//       types: 'lines,words',
//     });

//     this._element.style.opacity = '1';
//   }

//   animateIn() {
//     super.animateIn();
//     if (!this._text.lines) return;

//     this._text.lines.forEach((line, lineIndex) => {
//       Array.from(line.children).forEach((word, _wordIndex) => {
//         word.style.transition = `transform 1.5s ${
//           lineIndex * 0.2
//         }s cubic-bezier(0.77, 0, 0.175, 1)`;
//         word.classList.add('word--active');
//       });
//     });
//   }

//   animateOut() {
//     super.animateOut();

//     if (!this._text.lines) return;

//     this._text.lines.forEach((line, lineIndex) => {
//       Array.from(line.children).forEach((word, _wordIndex) => {
//         word.style.transition = `transform 1s ${lineIndex * 0.1}s cubic-bezier(0.77, 0, 0.175, 1)`;
//         word.classList.remove('word--active');
//       });
//     });
//   }

//   onResize() {
//     super.onResize();
//     this._text.revert();

//     this._text = new SplitType(this._element, {
//       tagName: 'span',
//       types: 'lines,words',
//     });

//     this.initObserver();
//   }
// }
