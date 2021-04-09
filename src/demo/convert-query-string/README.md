# How to Test  
## Testing Steps
1. execute the following command.  
    ```sh
    yarn watch
    ```
2. check the difference of what resources are about to be deployed. (you could open another terminal to execute)  
    ```sh
    # The default region is N. Virginia (us-east-1), which you could find
    # the configuration in `index.ts` under `src/demo/convert-query-string`.
    cdk --app lib/demo/convert-query-string/index.js diff
    ```  
3. deploy the stack  
   ```bash
   cdk --app lib/demo/convert-query-string/index.js deploy
   ```