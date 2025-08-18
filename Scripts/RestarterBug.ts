
import { MonoBehaviour } from "UnityEngine";
import { SceneManager } from "UnityEngine.SceneManagement";
import { Button } from "UnityEngine.UI";
import UpgradeMenu from "./UpgradeMenu";
import GameManager from "./GameManager";
import CameraMovement from "./CameraMovement";
import PlayerSounds from "./PlayerSounds";
export default class RestarterBug extends MonoBehaviour {
    
    @SerializeField restartButton: Button;

    private um: UpgradeMenu;
    private gm: GameManager;
    private cm: CameraMovement;
    private ps: PlayerSounds;

    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.restartButton.onClick.AddListener(this.PlayAgain);

        this.um = UpgradeMenu.Instance;
        this.gm = GameManager.Instance;
        this.cm = CameraMovement.Instance;
        this.ps = PlayerSounds.Instance;

        console.log(this.um.gameObject.name);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private PlayAgain()
    {
        // Show loading screen
        console.log(`PLAY AGAIN`);

        // Remove Instances
        //this.um.DestroyInstance();
        //this.gm.DestroyInstance();
        //this.cm.DestroyInstance();
        //this.ps.DestroyInstance();

        SceneManager.LoadScene("BugTest2");

        // Restart Everything
        //this.setupManager.RestartEverything();
    }
}
