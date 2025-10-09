
import { MonoBehaviour } from "UnityEngine";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import XPLeveling from "./XPLeveling";

export default class PlayerLevels extends MonoBehaviour {
    
    public static playerLevel: int = 1;
    public static playerXp: int = 0;

    // XP formula: 50xp per round, 1xp per second alive | ex: round 9 (400xp), 295s alive (295xp) = 695 xp total
    // survive 1st round: 50xp, survive 2nd round: 100xp, survive 3rd round: 150xp, etc. 

    // Level formula: 50n(n + 3) where n = player level
    // lvl 1: 200xp, lvl 2: 500xp, lvl 3: 900xp, lvl 4: 1400xp .... lvl 10: 6500xp, lvl 11: 7700xp, lvl 12: 9000xp ... lvl 20: 23,000xp
    
    //Called when script instance is loaded
    private Awake() : void
    {
        
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    async Start() 
    {
        await this.GetSaveData();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private async GetSaveData()
    {
        let playerStorage: CloudSaveStorage  = new CloudSaveStorage("PlayerStorage");
        let levelKey = "PlayerLevel";
        let xpKey = "PlayerXP";

        await this.EstablishScoreData(playerStorage, levelKey, 1);
        await this.EstablishScoreData(playerStorage, xpKey, 0);

        //playerStorage.SetInt(levelKey, 1);
        //playerStorage.SetInt(xpKey, 0);
        //await playerStorage.Save();

        PlayerLevels.playerLevel = playerStorage.GetInt(levelKey);
        PlayerLevels.playerXp = playerStorage.GetInt(xpKey);
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
}
