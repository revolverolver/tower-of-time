
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import { TextMeshProUGUI } from "TMPro";
import { MonoBehaviour } from "UnityEngine";
import Upgrades from "./Upgrades";
import PlayerHealth from "./PlayerHealth";

export default class PlayerStats extends MonoBehaviour {

    @SerializeField private lvlNumberText: TextMeshProUGUI;

    @SerializeField private healthText: TextMeshProUGUI;
    @SerializeField private walkText: TextMeshProUGUI;
    @SerializeField private chopText: TextMeshProUGUI;
    @SerializeField private carryText: TextMeshProUGUI;

    private playerLevel: int;
    private healthUpgrades: int[] = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41];
    private walkUpgrades: int[] = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42];
    private chopUpgrades: int[] = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43];
    private carryUpgrades: int[] = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44];

    public static walkBoost: float = 0;
    public static chopBoost: float = 0;
    public static carryBoost: float = 0;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.GetSaveData();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private async GetSaveData()
    {
        let playerStorage: CloudSaveStorage  = new CloudSaveStorage("PlayerStorage");
        let levelKey = "PlayerLevel";

        await this.EstablishScoreData(playerStorage, levelKey, 1);

        this.playerLevel = playerStorage.GetInt(levelKey);
        this.lvlNumberText.text = this.playerLevel.toString();

        // Set stats
        this.SetUpgradeStats();
        this.SetTexts();
    }

    private async EstablishScoreData(storage: CloudSaveStorage, scoreKey: string, defaultValue: int) {
        //Load data from storage
        await storage.Load();
        //Check if key exists in data
        if (storage.Has(scoreKey)) {
            //Get key value from data
            let score: int =  storage.GetInt(scoreKey);
            console.log("Storage of " + scoreKey + " has a value of " + score.toString());
        }else{
            console.log("Storage of " + scoreKey + " does not have a value yet");
            //Set initial key value
            storage.SetInt(scoreKey, defaultValue);
            //Save data to storage
            await storage.Save();
            console.log("Storage of " + scoreKey + " now has a value of " + defaultValue);
        }
    }

    private SetUpgradeStats() : void
    {
        // Health points
        for (let i = 0; i < this.healthUpgrades.length; i++)
        {
            if (this.playerLevel <= this.healthUpgrades[i]) {
                // Player level hasn't reached [i]. No upgrade
                break;
            } else {
                // Set upgrade at this level
                PlayerHealth.maxHealth = 10 + i + 1; // 1 point increase
                PlayerHealth.health = 10 + i + 1; // 1 point increase
            }
        }

        // Walk speed
        for (let i = 0; i < this.walkUpgrades.length; i++)
        {
            if (this.playerLevel <= this.walkUpgrades[i]) {
                // Player level hasn't reached [i]. No upgrade
                if (i == 0)
                {
                    // Set default value
                    PlayerStats.walkBoost = 1.0;
                }
                break;
            } else {
                // Set upgrade at this level
                let value: float = ((i + 1) / 100) * 2; // 2% increase
                PlayerStats.walkBoost = 1.0 + value;
            }
        }

        // Chop speed
        for (let i = 0; i < this.chopUpgrades.length; i++)
        {
            if (this.playerLevel <= this.chopUpgrades[i]) {
                // Player level hasn't reached [i]. No upgrade
                if (i == 0)
                {
                    // Set default value
                    PlayerStats.chopBoost = 1.0;
                }
                break;
            } else {
                // Set upgrade at this level
                let value: float = ((i + 1) / 100) * 2; // 2% increase
                PlayerStats.chopBoost = 1.0 + value;
            }
        }

        // Carry strength
        for (let i = 0; i < this.carryUpgrades.length; i++)
        {
            if (this.playerLevel <= this.carryUpgrades[i]) {
                // Player level hasn't reached [i]. No upgrade
                if (i == 0)
                {
                    // Set default value
                    PlayerStats.carryBoost = 1.0;
                }
                break;
            } else {
                // Set upgrade at this level
                let value: float = ((i + 1) / 100) * 2; // 2% increase
                PlayerStats.carryBoost = 1.0 + value;
            }
        }
    }

    private SetTexts() : void
    {
        this.healthText.text = PlayerHealth.maxHealth.toString();

        // "boost" = 1.0X (ex: 1.04 = 4% boost),  remove 1.0 = 0.0X to get a single digit percentage
        this.walkText.text = "+" + ((PlayerStats.walkBoost - 1.0) * 100).toFixed(0) + "%";
        this.chopText.text = "+" + ((PlayerStats.chopBoost - 1.0) * 100).toFixed(0) + "%";
        this.carryText.text = "+" + ((PlayerStats.carryBoost - 1.0) * 100).toFixed(0) + "%";
        // (this.playerLevel == 1) ? "+0%" : 
    }
}
