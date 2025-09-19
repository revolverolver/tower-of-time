
import { TextMeshProUGUI } from "TMPro";
import { CloudSaveStorage } from "Genies.Experience.CloudSave";
import { Animator, GameObject, MonoBehaviour, Time, Transform, Vector3, WaitForSeconds } from "UnityEngine";
import PlayerLevels from "./PlayerLevels";
import TimeManager from "./TimeManager";
import RoundManager from "./RoundManager";

export default class XPLeveling extends MonoBehaviour {

    @SerializeField private lvlNumberText: TextMeshProUGUI;
    @SerializeField private barFill: Transform;
    @SerializeField private animator: Animator;

    @SerializeField private xpGainedText: TextMeshProUGUI;
    @SerializeField private permanentIcons: GameObject[];
    @SerializeField private permanentText: TextMeshProUGUI;

    private permanentAmounts: string[] = ["+1", "+2%", "+2%", "+2%"];

    private xpGained: int = 0;

    private totalAfterGain: int = 0;
    private animatedXp: float = 0.0;
    private animatedLevel: int = 0;
    
    //Called when script instance is loaded
    private Awake() : void {}

    private SetupXP() : void
    {
        // Convert total time to XP
        let timeXp = Math.round(TimeManager.totalTime);
        this.xpGained += timeXp;

        // Gain 50xp for each round survived
        this.xpGained += 50 * (RoundManager.round - 1);

        // Set XP gained text
        this.xpGainedText.text = "+" + this.xpGained + " XP";

        console.log("XP GAINED: " + this.xpGained.toString());
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.SetupXP();

        // Setup Level number
        this.lvlNumberText.text = PlayerLevels.playerLevel.toString();

        // Set bar fill length based on previous xp
        let nextTotal = 50 * PlayerLevels.playerLevel * (PlayerLevels.playerLevel + 3);
        let currentTotal = 50 * (PlayerLevels.playerLevel - 1) * ((PlayerLevels.playerLevel - 1) + 3);

        let normalizedXp = (PlayerLevels.playerXp - currentTotal) / (nextTotal - currentTotal); // value between 0-1
        this.barFill.transform.localScale = new Vector3(normalizedXp, 1, 1); // Set bar length

        // Get starting values for the fill animation
        this.animatedLevel = PlayerLevels.playerLevel;
        this.animatedXp = PlayerLevels.playerXp;
        this.totalAfterGain = PlayerLevels.playerXp + this.xpGained;

        this.StartCoroutine(this.FillUpXpBar());

        // Set and save new XP and Level
        PlayerLevels.playerXp += this.xpGained;
        PlayerLevels.playerLevel = this.GetPlayerLevel();

        // Save level and xp to cloud
        this.SetSaveData();
    }

    private GetPlayerLevel() : int
    {
        let lvl = 1;
        let check = false

        while (check == false)
        {
            let nextLvl = 50 * lvl * (lvl + 3);
            if (PlayerLevels.playerXp > nextLvl)
            {
                lvl++;
            }
            else
            {
                check = true;
            }
        }

        return lvl;
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    *FillUpXpBar()
    {
        // Wait for animation to complete
        yield new WaitForSeconds(1.0);
        console.log("Wait over " + this.totalAfterGain + " anim: " + this.animatedXp);

        // Start filling up bar
        while (this.animatedXp < this.totalAfterGain)
        {
            // Get variables for the levels' XP
            let nextTotal = 50 * this.animatedLevel * (this.animatedLevel + 3);
            let currentTotal = 50 * (this.animatedLevel - 1) * ((this.animatedLevel - 1) + 3);

            // Increase XP
            this.animatedXp += Time.deltaTime * 350;
            if (this.animatedXp >= this.totalAfterGain) this.animatedXp = this.totalAfterGain;

            // Check for a level up
            if (this.animatedXp >= nextTotal)
            {
                // Level up
                this.animatedLevel++;

                // Update XP values
                nextTotal = 50 * this.animatedLevel * (this.animatedLevel + 3);
                currentTotal = 50 * (this.animatedLevel - 1) * ((this.animatedLevel - 1) + 3);

                // Update text
                this.lvlNumberText.text = this.animatedLevel.toString();

                // Setup level up animation
                this.SetupLevelUp();

                // Play animation
                this.animator.Play("Level_Up", -1, 0);
            }

            // set bar fill length
            let normalizedXp = (this.animatedXp - currentTotal) / (nextTotal - currentTotal); // value between 0-1
            this.barFill.transform.localScale = new Vector3(normalizedXp, 1, 1); // Set bar length

            // Wait for the next frame
            yield null;
        }
    }

    private SetupLevelUp() : void
    {
        // Calculate which upgrade to show
        let counter: int = 0;
        for (let i = 1; i < this.animatedLevel - 1; i++)
        {
            counter++;
            if (counter > 3) counter = 0;
        }

        // Show icon and hide the other
        for (let i = 0; i < 4; i++)
        {
            if (i == counter) 
                this.permanentIcons[i].SetActive(true);
            else 
                this.permanentIcons[i].SetActive(false);
        }

        // Set the text
        this.permanentText.text = this.permanentAmounts[counter];
    }

    private async SetSaveData()
    {
        let playerStorage: CloudSaveStorage  = new CloudSaveStorage("PlayerStorage");
        let levelKey = "PlayerLevel";
        let xpKey = "PlayerXP";

        await playerStorage.Load();

        // Set values
        playerStorage.SetInt(levelKey, PlayerLevels.playerLevel);
        playerStorage.SetInt(xpKey, PlayerLevels.playerXp);

        // Save to cloud
        await playerStorage.Save();

        console.log("Level: " + PlayerLevels.playerLevel + " & XP: " + PlayerLevels.playerXp + " saved to cloud");
    }
}
