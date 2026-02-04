export const CREATURES = {
    bear: {
        id: 'bear',
        emoji: '🐻',
        name: 'Little Cub',
        desc: 'Loves honey, naps, and rainy days. Grows stronger with every hug you share.',
        traits: [
            { icon: '🍯', name: 'Foodie' },
            { icon: '💤', name: 'Sleepy' }
        ],
        stats: { cuddle: 95, energy: 60 },
        gradient: { colors: ['#FFB7B2', '#FF9AA2'] } // coral -> dark coral
    },
    bunny: {
        id: 'bunny',
        emoji: '🐰',
        name: 'Bunny',
        desc: 'Gentle and soft-hearted. Brings peace to your haven with quiet presence.',
        traits: [
            { icon: '🌸', name: 'Gentle' },
            { icon: '✨', name: 'Magical' }
        ],
        stats: { cuddle: 90, energy: 75 },
        gradient: { colors: ['#E2F0CB', '#B5EAD7'] } // lavender -> mint
    },
    fox: {
        id: 'fox',
        emoji: '🦊',
        name: 'Fox',
        desc: 'Clever and adventurous. Always ready to explore new paths with you.',
        traits: [
            { icon: '🌲', name: 'Adventurer' },
            { icon: '🔥', name: 'Brave' }
        ],
        stats: { cuddle: 70, energy: 95 },
        gradient: { colors: ['#FFDAC1', '#FFB7B2'] } // peach -> coral
    },
    cat: {
        id: 'cat',
        emoji: '🐱',
        name: 'Kitty',
        desc: 'Curious and independent. Chooses when to cuddle, but loves deeply.',
        traits: [
            { icon: '🧶', name: 'Playful' },
            { icon: '🌙', name: 'Nocturnal' }
        ],
        stats: { cuddle: 85, energy: 80 },
        gradient: { colors: ['#C7CEEA', '#E2F0CB'] } // lavender -> light green
    },
    dragon: {
        id: 'dragon',
        emoji: '🐉',
        name: 'Dragon',
        desc: 'Magical and bold. Protects your haven with fierce loyalty and wonder.',
        traits: [
            { icon: '🔮', name: 'Magical' },
            { icon: '⭐', name: 'Legendary' }
        ],
        stats: { cuddle: 60, energy: 100 },
        gradient: { colors: ['#FFDAC1', '#C7CEEA'] } // peach -> lavender
    },
    penguin: {
        id: 'penguin',
        emoji: '🐧',
        name: 'Penguin',
        desc: 'Chill and loyal. Loves sliding into your heart with cool confidence.',
        traits: [
            { icon: '🧊', name: 'Chill' },
            { icon: '💙', name: 'Loyal' }
        ],
        stats: { cuddle: 88, energy: 50 },
        gradient: { colors: ['#B5EAD7', '#C7CEEA'] } // mint -> lavender
    },
    dog: {
        id: 'dog',
        emoji: '🐶',
        name: 'Puppy',
        desc: 'Loyal and full of joy. Always happy to see you and ready to play.',
        traits: [
            { icon: '🎾', name: 'Playful' },
            { icon: '🦴', name: 'Loyal' }
        ],
        stats: { cuddle: 90, energy: 95 },
        gradient: { colors: ['#FFDAC1', '#FFFFB5'] } // peach -> yellow (warm)
    }
};

export type CreatureType = keyof typeof CREATURES;
export type CreatureData = typeof CREATURES[CreatureType];
