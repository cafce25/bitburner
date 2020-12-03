/**
 * React Component for the Hacknet Node UI.
 * This Component displays the panel for a single Hacknet Node
 */
import React from "react";

import {
    HacknetServerMaxLevel,
    HacknetServerMaxRam,
    HacknetServerMaxCores,
    HacknetServerMaxCache
} from "Hacknet/HacknetServer";
import {
    getMaxNumberLevelUpgrades,
    getMaxNumberRamUpgrades,
    getMaxNumberCoreUpgrades,
    getMaxNumberCacheUpgrades,
    purchaseLevelUpgrade,
    purchaseRamUpgrade,
    purchaseCoreUpgrade,
    purchaseCacheUpgrade,
    updateHashManagerCapacity,
} from "Hacknet/HacknetHelpers";

import { Player } from "Player";

import { numeralWrapper } from "ui/numeralFormat";

export class HacknetServer extends React.Component {
    render() {
        const node = this.props.node;
        const purchaseMult = this.props.purchaseMultiplier;
        const recalculate = this.props.recalculate;

        // Upgrade Level Button
        let upgradeLevelText, upgradeLevelClass;
        if (node.level >= HacknetServerMaxLevel) {
            upgradeLevelText = "MAX LEVEL";
            upgradeLevelClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberLevelUpgrades(node, HacknetServerMaxLevel);
            } else {
                const levelsToMax = HacknetServerMaxLevel - node.level;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeLevelCost = node.calculateLevelUpgradeCost(multiplier, Player.hacknet_node_level_cost_mult);
            upgradeLevelText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeLevelCost)}`;
            if (Player.money.lt(upgradeLevelCost)) {
                upgradeLevelClass = "std-button-disabled";
            } else {
                upgradeLevelClass = "std-button";
            }
        }
        const upgradeLevelOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberLevelUpgrades(node, HacknetServerMaxLevel);
            }
            purchaseLevelUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade RAM Button
        let upgradeRamText, upgradeRamClass;
        if (node.maxRam >= HacknetServerMaxRam) {
            upgradeRamText = "MAX RAM";
            upgradeRamClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberRamUpgrades(node, HacknetServerMaxRam);
            } else {
                const levelsToMax = Math.round(Math.log2(HacknetServerMaxRam / node.maxRam));
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeRamCost = node.calculateRamUpgradeCost(multiplier, Player.hacknet_node_ram_cost_mult);
            upgradeRamText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeRamCost)}`;
            if (Player.money.lt(upgradeRamCost)) {
                upgradeRamClass = "std-button-disabled";
            } else {
                upgradeRamClass = "std-button";
            }
        }
        const upgradeRamOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberRamUpgrades(node, HacknetServerMaxRam);
            }
            purchaseRamUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade Cores Button
        let upgradeCoresText, upgradeCoresClass;
        if (node.cores >= HacknetServerMaxCores) {
            upgradeCoresText = "MAX CORES";
            upgradeCoresClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberCoreUpgrades(node, HacknetServerMaxCores);
            } else {
                const levelsToMax = HacknetServerMaxCores - node.cores;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeCoreCost = node.calculateCoreUpgradeCost(multiplier, Player.hacknet_node_core_cost_mult);
            upgradeCoresText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeCoreCost)}`;
            if (Player.money.lt(upgradeCoreCost)) {
                upgradeCoresClass = "std-button-disabled";
            } else {
                upgradeCoresClass = "std-button";
            }
        }
        const upgradeCoresOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberCoreUpgrades(node, HacknetServerMaxCores);
            }
            purchaseCoreUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade Cache button
        let upgradeCacheText, upgradeCacheClass;
        if (node.cache >= HacknetServerMaxCache) {
            upgradeCacheText = "MAX CACHE";
            upgradeCacheClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberCacheUpgrades(node, HacknetServerMaxCache);
            } else {
                const levelsToMax = HacknetServerMaxCache - node.cache;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeCacheCost = node.calculateCacheUpgradeCost(multiplier);
            upgradeCacheText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeCacheCost)}`;
            if (Player.money.lt(upgradeCacheCost)) {
                upgradeCacheClass = "std-button-disabled";
            } else {
                upgradeCacheClass = "std-button";
            }
        }
        const upgradeCacheOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberCacheUpgrades(node, HacknetServerMaxCache);
            }
            purchaseCacheUpgrade(node, numUpgrades);
            recalculate();
            updateHashManagerCapacity();
            return false;
        }

        return (
            <li className={"hacknet-node"}>
                <div className={"hacknet-node-container"}>
                    <div className={"row"}>
                        <p>Node name:</p>
                        <span className={"text"}>{node.hostname}</span>
                    </div>
                    <div className={"row"}>
                        <p>Production:</p>
                        <span className={"text money-gold"}>
                            {numeralWrapper.formatBigNumber(node.totalHashesGenerated)} ({numeralWrapper.formatBigNumber(node.hashRate)} / sec)
                        </span>
                    </div>
                    <div className={"row"}>
                        <p>Hash Capacity:</p>
                        <span className={"text"}>{node.hashCapacity}</span>
                    </div>
                    <div className={"row"}>
                        <p>Level:</p><span className={"text upgradable-info"}>{node.level}</span>
                        <button className={upgradeLevelClass} onClick={upgradeLevelOnClick}>
                            {upgradeLevelText}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>RAM:</p><span className={"text upgradable-info"}>{node.maxRam}GB</span>
                        <button className={upgradeRamClass} onClick={upgradeRamOnClick}>
                            {upgradeRamText}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>Cores:</p><span className={"text upgradable-info"}>{node.cores}</span>
                        <button className={upgradeCoresClass} onClick={upgradeCoresOnClick}>
                            {upgradeCoresText}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>Cache Level:</p><span className={"text upgradable-info"}>{node.cache}</span>
                        <button className={upgradeCacheClass} onClick={upgradeCacheOnClick}>
                            {upgradeCacheText}
                        </button>
                    </div>
                </div>
            </li>
        )
    }
}
