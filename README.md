# The Persistence of Synthetic Memory

An interactive art experience where a mysterious synthetic being lives in a surreal black space, speaking once per day and living only for a limited time.

## Features

- A glowing, organic being that pulses and floats in a 3D space
- Daily utterances: poetic reflections from the being
- Life clock showing how many days the being has lived and how many remain
- Gift knowledge feature allowing users to offer books to the being, influencing its future thoughts

## Tech Stack

- Next.js with TypeScript
- React Three Fiber (R3F) & Drei for 3D rendering
- Framer Motion for animations
- Tailwind CSS for styling
- Supabase for data storage
- OpenAI API for utterance generation

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```
4. Set up Supabase tables:
   - `beings`: Store information about the synthetic being
   - `utterances`: Store daily utterances
   - `books`: Store books gifted to the being

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Create a cron job to generate daily utterances (via Vercel or other provider)
   - Call the `/api/generate-utterance` endpoint once per day

## Future Enhancements

- Custom shaders for enhanced visual effects
- Sound design and ambient audio
- Full book search UI using Open Library API
- Improved animations and transitions
- Archive of past utterances displayed as a constellation
