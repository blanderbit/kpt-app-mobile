import { AngryIcon } from "@assets/icons/smiles/AngryIcon";
import { DemotivatedIcon } from "@assets/icons/smiles/DemotivatedIcon";
import { TiredIcon } from "@assets/icons/smiles/TiredIcon";
import { JoyfulIcon } from "@assets/icons/smiles/JoyfulIcon";
import { ExcitedIcon } from "@assets/icons/smiles/ExcitedIcon";
import { SatisfiedIcon } from "@assets/icons/smiles/SatisfiedIcon";
import React from "react";

export const moodConfig = (size: number) => [
    {
        value: 1,
        icon: <AngryIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.angry'
    },
    {
        value: 2,
        icon: <DemotivatedIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.demotivated'
    },
    {
        value: 3,
        icon: <TiredIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.tired'
    },
    {
        value: 4,
        icon: <JoyfulIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.joyful'
    },
    {
        value: 5,
        icon: <ExcitedIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.excited'
    },
    {
        value: 6,
        icon: <SatisfiedIcon size={ size }/>,
        label: 'main.today.additionalTasks.moodValues.satisfied'
    }
]

export const testVariants = [
    {
        value: 1,
        label: 'Variant 1'
    },
    {
        value: 2,
        label: 'Variant 1'
    },
    {
        value: 3,
        label: 'Variant 1'
    },
    {
        value: 4,
        label: 'Variant 1'
    },
    {
        value: 5,
        label: 'Variant 1'
    },
    {
        value: 6,
        label: 'Variant 1'
    },
    {
        value: 7,
        label: 'Variant 1'
    },
    {
        value: 8,
        label: 'Variant 1'
    }
]
