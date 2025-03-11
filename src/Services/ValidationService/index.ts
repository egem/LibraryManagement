import { Requirements } from 'Models/Requirements.model';
import { validateName } from 'Utils/Validators/NameValidator';

export class ValidationService {
  checkString(
    input: string,
    optional?: {
      blackList?: string[];
    }
  ): boolean {
    const blackList = optional?.blackList || [];

    const hasForbiddenChar = blackList.find(
      (forbiddenCharacter) => input.includes(forbiddenCharacter)
    );

    return !hasForbiddenChar;
  }

  checkUserName(
    userName: string,
    requirements: Requirements
  ): boolean {
    if (
      !userName ||
      (
        userName.length > requirements.user.name.maxLength
      ) ||
      !this.checkString(
        userName,
        {
          blackList: ['\n', '\t', '  ']
        }
      ) ||
      !validateName(
        userName
      )
    ) {
      return false;
    }

    return true;
  }

  checkBookName(
    bookName: string,
    requirements: Requirements
  ): boolean {
    if (
      !bookName ||
      (
        bookName.length > requirements.book.name.maxLength
      ) ||
      !this.checkString(
        bookName,
        {
          blackList: ['\n', '\t', '  ']
        }
      ) ||
      !validateName(
        bookName
      )
    ) {
      return false;
    }

    return true;
  }

  checkBookScore(
    score: number,
    requirements: Requirements
  ): boolean {
    if (
      !Number.isInteger(score) ||
      (
        score < requirements.book.score.min
      ) ||
      (
        score > requirements.book.score.max
      )
    ) {
      return false;
    }

    return true;
  }
}
