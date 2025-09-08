export interface Article {
    id: number;
    image: string;
    title: string;
    description: string;
    data: { title: string, description: string }[]
}

export const testArticles: Article[] = [
    {
        id: 1,
        image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWkAAACkCAYAAABVet+QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASYSURBVHgB7d3vURtHHMfhPVdAOhAVABUEd4ArcFIBdgWIDkIFIRXgDoIrAFeAXIHpQN41e4zAAsQfi++Mn2dmdXASvPzMzu+k01BewHw+36iHvbq26prUtV3XRl8Av4NZX+d1fanrdBiGWXmmoTxRD/N+Xbt9AXBTC/ZReUawHx3phTh/KHbKAKs6ruvwsbF+VKRroA+KOAM8x7SG+nDVF68U6RrnST2clKtZMwDPM6vr7Sq76jcPvaAG+n09nBWBBngpk7rOal/3HnrhvZHu443jYrwB8NJaV096Z+9057ij/+G0APCr3TmnXhrpvgU/KQCsy1811P/dPvlTpPtFwjaDNuIAWJ/LunZuX0xcFumLcjXUBmC9zmukdxZP3Lhw2OfQkwLAa9iuHZ4unrjeSfcxx0UB4DW1scdm3VG3442d9EEB4LW164Efxl9+7KTtogGiXO+mx530bgEgxfVueoz0fgEgyZ/tYTDqAIj1R9tJ7xYAEu21SLu7HUCm7RbprQJAokmL9KQAkGirXTicFwASXYo0QLAHvz4LgNcj0gDBRBogmEgDBBNpgGAiDRBMpAGCiTRAMJEGCCbSAMFEGiCYSAMEE2mAYCINEEykAYKJNEAwkQYIJtIAwUQaIJhIAwQTaYBgIg0QTKQBgok0QDCRBggm0gDBRBogmEgDBBNpgGAiDRBMpAGCiTRAMJEGCCbSAMFEGiCYSAMEE2mAYCINEEykAYKJNEAwkQYIJtIAwUQaIJhIAwQTaYBgIg0QTKQBgok0QDCRBggm0gDBRBogmEgDBBNpgGAiDRBMpAGCiTRAMJEGCCbSAMFEGiCYSAMEE2mAYCINEEykAYKJNEAwkQYIJtIAwUQaIJhIAwQTaYBgIg0QTKQBgok0QDCRBggm0gDBRBogmEgDBBNpgGAiDRBMpAGCiTRAMJEGCCbSAMFEGiCYSAMEE2mAYCINEEykAYKJNEAwkQYIJtIAwUQaIJhIAwQTaYBgIg0QTKQBgok0QDCRBggm0gDBRBogmEgDBBNpgGAiDRBMpAGCiTRAMJEGCCbSAMFEGiCYSAMEE2mAYCINEEykAYKJNEAwkQYIJtIAwUQaIJhIAwQTaYBgLdKXBYBIIg2Qa9YifV4ASPQj0l8LAIm+2EkD5Dof5vP5Rv3hWwEgzeabYRjahcPTAkCS89rn2fg+6c8FgCRH7WFoD33kcVHXRgEgweb1TrqPPI4KAAmOW6DbD8N4xm4aIMbmGOnre3fYTQNEOBwD3Qy3n6076rN62C4ArNusBnpz8cSyu+C9K+7nAbBurbtvb5/8KdJ9m/2xALBOfy+OOUZL7yddX3hcD4cFgHVoc+hPy54Y7vurOp+e1sNBAeBXaYGe3vXkvZFuaqj36uHf4q15AC+pzaA/9snFnR6MdFNDPamH/+uaFACeq9199N2yGfRtK33HYftH/W0h5tQAT9d2z228sbNKoJuVdtKL+q56Wtf7AsAqxg8L/tM/OLiyR0d61GO9W9d+8eEXgGVOy9VdRh8d59GTI71oIdgt1lvlanY9KQC/h8u+2qz5az9+emqYF30Hgd7GYHAH4gEAAAAASUVORK5CYII=',
        title: 'The Power of Habits: Transforming Your Life One Step at a Time',
        description: 'Habits play a crucial role in shaping our daily lives and overall well-being. Whether positive or negative, these automatic behaviors influence our productivity, health, and happiness. Understanding the science of habits can empower us to make meaningful changes.',
        data: [
            {
                title: 'The Habit Loop',
                description: 'Habits are formed through a simple loop: cue, routine, and reward. A cue triggers a behavior, the routine is the behavior itself, and the reward reinforces the habit. Identifying this loop in our daily actions helps us recognize patterns and make adjustments.'
            },
            {
                title: 'Start Small',
                description: 'When aiming to develop new habits, start with small, manageable changes. For example, if you want to read more, begin with just five minutes a day. Gradually increase the time as the habit becomes ingrained. This approach reduces overwhelm and increases the likelihood of success.'
            }
        ]
    }
]
