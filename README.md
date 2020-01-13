# FullStackBlockchain

### NOTE: Project still under development (WIP)
Explanation **(WIP)**: Full-Stack Application of Blockchain and paired cryptocurrency, implemented from scratch using Javascript and cryptographic Javascript libraries 

  * ***Purpose:***
	> Build a traditional, proof-of-work Blockchain with supported cryptocurrency for secure, peer-to-peer transactions, entirely from scratch using Javascript
	
	> While the asset (and its correposnding digital twin) has yet to be determined *(as of 1/12/2020)*, this project is to demonstrate the utility of a 
	traditional blockchain in ensuring transactional security & authenticity of data while optimizing business logic, based entirely on first principles 

  * **Utility:**
	Technical
	1. Confidentiality, Integrity, Availability of transactional data at rest & in motion
	
	2. Nonrepudiation due to time-stamped, hash-linked blocks of data, leading to an irrefutable transactional record

  * **Design:**
	1. ***(COMPLETED 1/11/2020)*** Proof-Of-Work (PoW) Consensus Algorithm 
	
	2. REST APIs for Blockchain instances to communicate with each other
	
	3. PubSub protocol for asynchronous communication 
  
  * **Technologies:**
	1. NodeJS
	
	2. React
	
	3. Heroku
	
	4. Javascript

  * **Development Tools:**
	1. Visual Studio Code

	2. Postman

	3. Bash shell

  * ***Dependencies: (as outlined in package.json)***
	1. Jest testing framework (v23.6.0)
	
	2. hexToBinary library (v1.0.1)
	
	3. nodeMon (v1.18.4)
	
	4. express (v4.16.3)
	
	5. bodyParser middleware (v1.18.3)

	6. redis (v2.8.0)

To run the unit tests found within the various test.js files, type:
  > npm run test
  
To determine timestamp calculation and difficulty of impending blocks using the Proof-Of-Work Blockchain, type:
  > node average-work.js