import React, { Fragment, useCallback, useState } from "react"

import { noEmpty } from "."
import { render } from "./render"
import { axios } from "~/config/axios"

function checkPasswordSafety(password: string) {
  // Define criteria for different safety levels
  const lengthRegex = /\S{6,}/;  // Minimum length of 6 characters
  const digitRegex = /\d/;      // Should contain at least one digit
  const lowercaseRegex = /[a-z]/; // Should contain at least one lowercase letter
  const uppercaseRegex = /[A-Z]/; // Should contain at least one uppercase letter
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // Should contain at least one special character
  const moreThanOneSpecialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g

  // Evaluate each criterion
  const isLengthValid = lengthRegex.test(password);
  const containsDigit = digitRegex.test(password);
  const containsLowercase = lowercaseRegex.test(password);
  const containsUppercase = uppercaseRegex.test(password);
  const containsSpecialChar = specialCharRegex.test(password);
  const containsMoreThanOneSpecialCharRegex = (
    moreThanOneSpecialCharRegex.test(password)
    && Number(password.match(moreThanOneSpecialCharRegex)?.length) >= 2
  )

  // Count the number of criteria met
  const criteriaMet = [
    isLengthValid,
    containsDigit,
    containsLowercase,
    containsUppercase,
    containsSpecialChar,
    containsMoreThanOneSpecialCharRegex
  ].filter(Boolean).length;

  // Determine safety level based on the number of criteria met
  if (criteriaMet === 0 || !isLengthValid) {
    return "very-weak";
  } else if (criteriaMet === 1) {
    return "weak";
  } else if (criteriaMet === 2) {
    return "normal";
  } else if (criteriaMet === 3) {
    return "good";
  } else if (criteriaMet === 4) {
    return "strong";
  } else if (criteriaMet >= 5) {
    return "very-strong";
  }

  return "strong";
}

type UserNameButtonsProps = {
  suggestedUsernames: string[]
}

type UsernameList = Array<string>

export function handleRegisterForm(registerForm: HTMLFormElement): void {
  const nameField = registerForm.querySelector<HTMLInputElement>('[name="user[name]"]')
  const userPasswordField = registerForm.querySelector<HTMLInputElement>('[name="user[password]"]')
  const usernameField = registerForm.querySelector<HTMLInputElement>('[name="user[username]"]')

  const UserNameButton: React.FC<{ value: string }> = ({ value }) => {
    const [className, setClassName] = useState<UsernameList>(['form-username-suggestion'])

    const buttonClickHandler = useCallback(() => {
      if (formUsernameSuggestionsList) {
        Array.from<HTMLButtonElement>(formUsernameSuggestionsList.querySelectorAll('.selected'))
          .forEach(button => button.classList.remove('selected'))

        if (className.length < 2) {
          setClassName(['form-username-suggestion', 'selected'])
        }

        if (usernameField) {
          usernameField.value = value
        }
      }
    }, [])

    return (
      <li className="form-username-suggestions-list-item">
        <button
          type="button"
          data-value={value}
          className={className.join(' ')}
          onClick={buttonClickHandler}>
          {value}
        </button>
      </li>
    )
  }

  const UserNameButtons: React.FC<UserNameButtonsProps> = () => {
    const [usernames, setUsernames] = useState<string[]>([])

    const getUserNameSuggestions = useCallback(async (): Promise<void> => {
      const name = nameField?.value

      if (!noEmpty(name)) {
        return
      }

      const response = await axios.get<UsernameList>('/private/utils/generateUserName', {
        params: {
          name,
          quantity: 6
        }
      })

      if (response.data instanceof Array) {
        setUsernames(response.data)

        if (formUsernameSuggestionsList && formUsernameSuggestionsList.parentNode) {
          (formUsernameSuggestionsList.parentNode as HTMLElement).classList.remove('hidden')
        }
      }
    }, [])

    if (nameField instanceof HTMLInputElement) {
      nameField.addEventListener('change', () => getUserNameSuggestions())
    }

    return (
      <Fragment>
        {usernames.map((value, index) => (
          <UserNameButton key={index} value={value} />
        ))}
      </Fragment>
    )
  }

  const formUsernameSuggestionsList = registerForm.querySelector<HTMLUListElement>('div.form-username-suggestions-list-container ul.form-username-suggestions-list')

  if (formUsernameSuggestionsList) {
    render<UserNameButtonsProps>('data-register-from', formUsernameSuggestionsList, UserNameButtons)
  }

  const userPasswordFieldChangeEvents: Array<string> = [
    'change',
    'keydown'
  ]

  userPasswordFieldChangeEvents.forEach(userPasswordFieldChangeEvent => {
    if (!userPasswordField) {
      return
    }

    userPasswordField.addEventListener(userPasswordFieldChangeEvent, () => {
      const userPassword = String(userPasswordField.value).trim()

      const safetyLevels = [
        'very-weak',
        'weak',
        'normal',
        'good',
        'strong',
        'very-strong'
      ]

      const safetyLevel = checkPasswordSafety(userPassword)
      const safetyLevelIndex = safetyLevels.indexOf(safetyLevel)

      const formPasswordSafetyProgressWrapper = registerForm.querySelector<HTMLDivElement>('div.form-password-safety-progress-wrapper')

      if (!(formPasswordSafetyProgressWrapper && safetyLevelIndex >= 0)) {
        return
      }

      formPasswordSafetyProgressWrapper.setAttribute('state', safetyLevel)

      Array.from(formPasswordSafetyProgressWrapper.querySelectorAll<HTMLElement>('i'))
        .map(element => {
          element.classList.remove('colored')
          return element
        })
        .slice(0, safetyLevelIndex + 1)
        .forEach(element => {
          element.classList.add('colored')
        })
    })
  })
}
