
import { MonoBehaviour, Camera, Transform, Vector3, Time } from "UnityEngine";
export default class WoodUI extends MonoBehaviour {

    @SerializeField private target: Transform;
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void {}

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void 
    {
        this.FollowPlayer();
    }

    private FollowPlayer()
    {
        let pos = Camera.main.WorldToScreenPoint(this.target.position);
        this.transform.position = Vector3.Lerp(this.transform.position, pos, Time.deltaTime * 10);
    }
}
