/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import * as React from "react";

import {
    getNextNeurofluxLevel,
    hasAugmentationPrereqs,
    purchaseAugmentation,
    purchaseAugmentationBoxCreate,
} from "Faction/FactionHelpers";

import { Augmentation } from "Augmentation/Augmentation";
import { Augmentations } from "Augmentation/Augmentations";
import { AugmentationNames } from "Augmentation/data/AugmentationNames";
import { Faction } from "Faction/Faction";
import { IPlayer } from "PersonObjects/IPlayer";
import { Settings } from "Settings/Settings";
import { numeralWrapper } from "ui/numeralFormat";
import { IMap } from "types";

import { StdButton } from "ui/React/StdButton";

type IProps = {
    augName: string;
    faction: Faction;
    p: IPlayer;
    rerender: () => void;
}

const spanStyleMarkup = {
    margin: "4px",
    padding: "4px",
}

const inlineStyleMarkup = {
    display: "inline-block",
}

export class PurchaseableAugmentation extends React.Component<IProps, any> {
    aug: Augmentation | null;

    constructor(props: IProps) {
        super(props);

        this.aug = Augmentations[this.props.augName];

        this.handleClick = this.handleClick.bind(this);
    }

    getMoneyCost(): number {
        return this.aug!.baseCost * this.props.faction.getInfo().augmentationPriceMult;
    }

    getRepCost(): number {
        return this.aug!.baseRepRequirement * this.props.faction.getInfo().augmentationRepRequirementMult;
    }

    handleClick() {
        if (!Settings.SuppressBuyAugmentationConfirmation) {
            purchaseAugmentationBoxCreate(this.aug!, this.props.faction);
        } else {
            purchaseAugmentation(this.aug!, this.props.faction);
        }
    }

    // Whether the player has the prerequisite Augmentations
    hasPrereqs(): boolean {
        return hasAugmentationPrereqs(this.aug!);
    }

    // Whether the player has enough rep for this Augmentation
    hasReputation(): boolean {
        return this.props.faction.playerReputation >= this.getRepCost();
    }

    // Whether the player has this augmentations (purchased OR installed)
    owned(): boolean {
        let owned = false;
        for (const queuedAug of this.props.p.queuedAugmentations) {
            if (queuedAug.name === this.props.augName) {
                owned = true;
                break;
            }
        }

        for (const installedAug of this.props.p.augmentations) {
            if (installedAug.name === this.props.augName) {
                owned = true;
                break;
            }
        }

        return owned;
    }

    render() {
        if (this.aug == null) {
            console.error(`Invalid Augmentation when trying to create PurchaseableAugmentation display element: ${this.props.augName}`);
            return null;
        }

        const moneyCost = this.getMoneyCost();
        const repCost = this.getRepCost();

        // Determine UI properties
        let disabled: boolean = false;
        let statusTxt: string = "";
        let color: string = "";
        if (!this.hasPrereqs()) {
            disabled = true;
            statusTxt = `LOCKED (Requires ${this.aug.prereqs.join(",")} as prerequisite(s))`;
            color = "red";
        } else if (this.aug.name !== AugmentationNames.NeuroFluxGovernor && (this.aug.owned || this.owned())) {
            disabled = true;
            statusTxt = "ALREADY OWNED";
        } else if (this.hasReputation()) {
            statusTxt = `UNLOCKED - ${numeralWrapper.formatMoney(moneyCost)}`;
        } else {
            disabled = true;
            statusTxt = `LOCKED (Requires ${numeralWrapper.format(repCost, "0,0.0")} faction reputation - ${numeralWrapper.formatMoney(moneyCost)})`;
            color = "red";
        }

        const txtStyle: IMap<string> = {
            display: "inline-block",
        }
        if (color !== "") { txtStyle.color = color; }

        // Determine button txt
        let btnTxt = this.aug.name;
        if (this.aug.name === AugmentationNames.NeuroFluxGovernor) {
            btnTxt += ` - Level ${getNextNeurofluxLevel()}`;
        }

        return (
            <li>
                <span style={spanStyleMarkup}>
                    <StdButton
                        disabled={disabled}
                        onClick={this.handleClick}
                        style={inlineStyleMarkup}
                        text={btnTxt}
                        tooltip={this.aug.info}
                    />
                    <p style={txtStyle}>{statusTxt}</p>
                </span>
            </li>
        )
    }
}
