# DevOpsProject - Group 10

![NodeJS current tests status](https://github.com/plugnpush/devopsproject/actions/workflows/node.js.yml/badge.svg)  
![Static current tests status](https://github.com/plugnpush/devopsproject/actions/workflows/static.yml/badge.svg)

Members: LACHAUD Antoine, LE LAY Logan, MARGUET Vincent, MARQUES Romain, NASS Michaël, RINCHEVAL Antoine, THAVARASA Jathoosh  

The project report in PDF format is avalable [here](https://github.com/PlugNPush/DevOpsProject/blob/main/Project%20Report.pdf).

The live deployment of the website through the GitHub Actions CI Pipeline is available [here: https://plugnpush.github.io/DevOpsProject/](https://plugnpush.github.io/DevOpsProject/).  

We decided to go a step further, and also take care of the backend deployment, using the Cyclic cloud provider and AWS for the database storage.  
The backend API and database is deployed in parallel with the static deployment to GitHub Pages, and is available at [https://devopsproject.cyclic.app](https://devopsproject.cyclic.app).  
You can try the API by accessing [this link](https://devopsproject.cyclic.app/api/friend/followers/CrooZ), you should see a JSON output with an int status of 200 and the number of followers of the user CrooZ.  

Cyclic uses a serverless achitecture that is built on top of AWS Lambda and allows us inside the private network to access a dedicated Amazon S3 bucket to store our database files. The access to AWS is granted by dynamically changing environment variables, automatically used by the AWS SDK in real-time.  
Cyclic also provides an access to an Amazon Dynamo DB instance for more efficient database processing, but the current implementation of the code does not support it as it is (as it is raw json-like file based).  
More importantly, as students, we choose Cyclic because it is free (with limits), but we could integrate any other deployment environemnt service, if not AWS/Azure directly.  

<img alt="Screenshot 2023-07-19 at 21 45 19" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/2b140aa8-9c59-40f2-8a93-2a2fa11bd7db"><br>  
<img alt="Screenshot 2023-07-19 at 21 45 36" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/483c4cc7-c312-4d05-989b-98c855339a35"><br>  
<img alt="Screenshot 2023-07-19 at 21 45 54" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/c656a109-c56c-4226-baeb-e4c38dc95d70"><br>  
<img alt="Screenshot 2023-07-19 at 22 15 11" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/e753bf83-6b94-47bc-894a-1bd7c452fe24"><br>  
<img alt="Screenshot 2023-07-19 at 22 15 59" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/44e8de6c-bf37-4ff6-af6e-2cfec14c3e71"><br>  
<img alt="Screenshot 2023-07-19 at 22 17 08" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/83e9381a-8e7f-44aa-854b-d7b619b56928"><br>  
<img alt="Screenshot 2023-07-19 at 21 48 43" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/1bc37977-4b4f-4af3-b9a3-92e7d961d848"><br>  
<img alt="Screenshot 2023-07-19 at 21 50 27" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/04be76a9-6d2b-4f58-bd5b-b14f8e5e43d1"><br>  
<img alt="Screenshot 2023-07-19 at 21 51 54" src="https://github.com/PlugNPush/DevOpsProject/assets/31410359/bf0b265f-9f80-4c96-8fb9-ab68f9297cc4"><br>  


## Project Description

This project is a simple web application that imitate Twitter. The application is built using React.js and express.js. The application has for only purpose to demonstrate a deployment pipeline using GitHub Actions and GitHub Pages. Also comes with a Discord Webhook integration.

## Run the project 

See the `README.md` of the following packages : `my-app` and `server`.

## Bonus :

### Shell Script Test

We implemented a shell script to test if the home page answered with the code 200. The file is at the root of the project
and is called ``check-script.sh``. It returns 1 and a print if the page answers with anything except 200.

To run the shell script, run the following command :

```shell
bash ./check-script.sh
```

### Cypress Test

We implemented a cypress test to check that the page is connected (200 answered) and the front element is present. We 
checked the main page elements.

To run cypress, run the following commands :
```shell
cd ./my-app
npx cypress open
```

Then pick EC2 Testing, then Chrome and click on "Start E2E Testing in Chrome". Finally, click on "basic-test". The test
is then running. If everything was ok, on the top left of the page you should see the picture the green cross. As follow :
![Test Cypress](./CypressTest.png)

You can also launch the tests by command line :

Which will lead to the following image :

```shell
cd ./my-app
npx cypress run
```

![img.png](./Cypress-CmdLine.png)
We can see that all tests passed (we have only one `basic-test.cy.js`).
