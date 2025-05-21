
# Password Challenge Game


## Overview

The Password Challenge Game is an interactive web application that gamifies the concept of password security. Players must create a password that meets increasingly difficult security requirements as they progress through the game's eight levels.

## Features
- **Progressive Difficulty**: The game introduces new password requirements with each level
- **Real-time Validation**: Instant feedback on whether each requirement is met
- **Engaging UI**: Animated, interactive interface with visual feedback
- **Score Tracking**: Points awarded for each completed requirement
- **Level System**: Progress through 8 levels of password security
- **Victory Celebration**: Special animation and feedback when the game is completed

## Technical Stack

- **React**: Frontend UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: UI component library
- **Lucide React**: Icon library
- **React Router**: Navigation between pages

## Password Requirements

1. **Level 1**: Password must be at least 5 characters long
2. **Level 2**: Must contain at least one uppercase letter
3. **Level 3**: Must contain at least one number
4. **Level 4**: Must contain at least one special character
5. **Level 5**: No three consecutive characters can be the same
6. **Level 6**: Password length must be a prime number
7. **Level 7**: Must contain a month name (e.g., January)
8. **Level 8**: Equal number of uppercase and lowercase letters

## Running Locally

```bash
# Clone the repository
git clone https://github.com/flamechargerr/password-challenge-game.git

# Navigate to project directory
cd password-challenge-game

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Testing

The project includes comprehensive testing for all components:

```bash
# Run tests
npm test
```

## Educational Value

The Password Challenge Game serves as an interactive educational tool about password security principles:

- Demonstrates why length, complexity, and uniqueness matter in passwords
- Illustrates various security constraints in an engaging way
- Makes password security education fun rather than intimidating

## Credits

Created with love by Flamechargerr (Anamay)

## License

MIT
