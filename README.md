# Submission for TigerGraph Hackathon

pls check submission video for details - https://www.youtube.com/watch?v=uyVaJmVIJfc

### Show all security events for a person and his/her related persons with type of data exposed

#### Legend, persons - blue, event -red, data exposed - yellow

![image](https://user-images.githubusercontent.com/104097974/165100919-cb6bc74d-6368-4d70-b79b-09dff0f88392.png)


# Steps to reproduce
1. Install python and Jupyter Notebook
2. cd to root directory (where package.gson file is)
3. Run the attached Jupyter Notebook - `personal_information_graph.ipynb` after adding details of tigergraph hostname, username and password
4. Install node on a system whcih has connectiivty with the TigerGraph server.
5. Install node dependencies (`npm install`)
6. Update `config.js` file with details of node server, tocken and secret.
7. Run `npm index.js`, which starts local node server listening on port 

# Sample outputs - 

### Data stored by different companies

remember there is relation ship between companies and servic provider

example - Goolgle > Google Maps > Maps Service > Geo location

![image](https://user-images.githubusercontent.com/104097974/165100779-f22a7082-6d8c-407d-ad37-0ff68bb44684.png)


