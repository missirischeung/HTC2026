export type Step = {
    id: number;
    text: string;    // full instruction (agent voice)
    prompt?: string; // short UI instruction
  };
  
  export type Recipe = {
    id: string;
    title: string;
    description: string;
    image: string;
    steps: Step[];
  };
  
  export const RECIPES: Recipe[] = [
    {
      id: "simple-tomato-sauce",
      title: "Simple Tomato Sauce",
      description: "Cozy, classic, and fast. Perfect for pasta night.",
      image:
        "https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1400&q=80",
      steps: [
        // {
        //   id: 1,
        //   text: "Wash and prepare all ingredients, including tomatoes, onion, and garlic.",
        //   prompt: "Prep ingredients",
        // },
        {
          id: 1,
          text: "The only ingredient you need for this step is a cucumber.",
          prompt: "Obtain cucumber",
        },
        {
          id: 2,
          text: "Dice the onion finely and mince the garlic cloves.",
          prompt: "Dice onion, mince garlic",
        },
        {
          id: 3,
          text: "Heat olive oil in a pan and sauté the onions until soft and translucent, about three to four minutes.",
          prompt: "Sauté onions",
        },
        {
          id: 4,
          text: "Add the garlic and cook briefly until fragrant, about thirty seconds.",
          prompt: "Add garlic",
        },
        {
          id: 5,
          text: "Add tomatoes and let the sauce simmer gently for eight to ten minutes.",
          prompt: "Simmer sauce",
        },
      ],
    },
  
    {
      id: "quick-veg-stir-fry",
      title: "Quick Veg Stir-Fry",
      description: "Crunchy veggies with a glossy sauce in under 15 minutes.",
      image:
        "https://images.unsplash.com/photo-1604908554162-45f15b0d5b2e?auto=format&fit=crop&w=1400&q=80",
      steps: [
        {
          id: 1,
          text: "Wash and chop all vegetables into bite-sized pieces.",
          prompt: "Chop vegetables",
        },
        {
          id: 2,
          text: "In a small bowl, mix soy sauce, garlic, sugar, and a splash of water.",
          prompt: "Mix sauce",
        },
        {
          id: 3,
          text: "Heat a wok or large pan over high heat and add oil.",
          prompt: "Heat wok",
        },
        {
          id: 4,
          text: "Add vegetables and stir-fry quickly until just tender, about four to six minutes.",
          prompt: "Stir-fry veggies",
        },
        {
          id: 5,
          text: "Pour in the sauce and toss everything together for thirty to sixty seconds.",
          prompt: "Add sauce",
        },
      ],
    },
  
    {
      id: "scrambled-eggs",
      title: "Soft Scrambled Eggs",
      description: "Creamy eggs made gently, perfect for breakfast.",
      image:
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1400&q=80",
      steps: [
        {
          id: 1,
          text: "Crack the eggs into a bowl and whisk until fully combined.",
          prompt: "Whisk eggs",
        },
        {
          id: 2,
          text: "Heat a non-stick pan on low heat and add butter.",
          prompt: "Heat pan",
        },
        {
          id: 3,
          text: "Pour in the eggs and stir slowly with a spatula.",
          prompt: "Cook slowly",
        },
        {
          id: 4,
          text: "Remove from heat when softly set and still slightly glossy.",
          prompt: "Remove from heat",
        },
      ],
    },
  
    {
      id: "pan-seared-chicken",
      title: "Pan-Seared Chicken",
      description: "Juicy chicken with a golden crust.",
      image:
        "https://images.unsplash.com/photo-1604908177522-429a09a0b7f6?auto=format&fit=crop&w=1400&q=80",
      steps: [
        {
          id: 1,
          text: "Pat the chicken dry and season both sides with salt and pepper.",
          prompt: "Season chicken",
        },
        {
          id: 2,
          text: "Heat oil in a pan over medium-high heat until shimmering.",
          prompt: "Heat oil",
        },
        {
          id: 3,
          text: "Place chicken in the pan and cook without moving until a golden crust forms.",
          prompt: "Sear chicken",
        },
        {
          id: 4,
          text: "Flip and cook the other side until fully cooked through.",
          prompt: "Flip and finish",
        },
        {
          id: 5,
          text: "Let the chicken rest for a few minutes before serving.",
          prompt: "Rest chicken",
        },
      ],
    },
  
    {
      id: "garlic-noodles",
      title: "Garlic Noodles",
      description: "Savory, buttery noodles with tons of garlic flavor.",
      image:
        "https://images.unsplash.com/photo-1617196037304-1f47bcb5fcbb?auto=format&fit=crop&w=1400&q=80",
      steps: [
        {
          id: 1,
          text: "Boil noodles in salted water until just tender.",
          prompt: "Boil noodles",
        },
        {
          id: 2,
          text: "Mince garlic and prepare butter and seasonings.",
          prompt: "Prep garlic",
        },
        {
          id: 3,
          text: "Melt butter in a pan and sauté garlic gently until fragrant.",
          prompt: "Sauté garlic",
        },
        {
          id: 4,
          text: "Add drained noodles to the pan and toss to coat.",
          prompt: "Add noodles",
        },
        {
          id: 5,
          text: "Season and serve immediately while hot.",
          prompt: "Season and serve",
        },
      ],
    },
  ];
  