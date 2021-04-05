# How to Test
<a name="notes-before-deploying">Notes before deploying</a>  
<a name="testing-steps">Testing Steps</a>
## Notes before deploying  
1. Make sure to share the root folder with Docker  
   ```txt
   // The root directory is where you clone the github repo.
   ${ROOT_DIRECTORY}
   ```
2. How to share the folder with Docker ?  
   For detail, you can refer to [here](https://docs.docker.com/docker-for-mac/).
   ```bash
   // For Docker Desktop
   Preferences >> Resource >> File Sharing >> Add ${ROOT_DIRECTORY}
   ```
3. It's only tested on a MacBook Pro.  
   ```bash
    ProductName:	    macOS
    ProductVersion:	11.2.3
    BuildVersion:	    20D91
   ```

## Testing Steps
1. execute the following command.  
    ```sh
    yarn watch
    ```
2. check the difference of what resources are about to be deployed. (you could open another terminal to execute)  
    ```sh
    # The default region is N. Virginia (us-east-1)
    cdk --app lib/demo/convert-query-string/index.js diff
    ```  
3. deploy the stack  
   ```bash
   cdk --app lib/demo/convert-query-string/index.js deploy
   ```

