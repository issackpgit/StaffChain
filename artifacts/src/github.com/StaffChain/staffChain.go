package main

import(
  "fmt"
  "strconv"
  "log"
  "encoding/json"

  "github.com/hyperledger/fabric/core/chaincode/shim"
  pp "github.com/hyperledger/fabric/protos/peer"

  "gopkg.in/mgo.v2"
  "gopkg.in/mgo.v2/bson"
)

var logger = shim.NewLogger("staffChain0")

type staffChain struct {
}

type Employee struct {
    Name string `json:"name"`
    DOB string `json:"dob"`
    CurEmployer string `json:"curEmployer"`
}

//###################################

type Person struct {
    Name string
    Phone string
}




// ####################################


func (t* staffChain) Init(stub shim.ChaincodeStubInterface) pp.Response {
  logger.Info("########## StaffChain Init ##########")

    employees := []Employee{
      Employee{Name:"Issac",DOB:"04/07/1992",CurEmployer:"IBM"},
      Employee{Name:"Reshma",DOB:"05/25/1992",CurEmployer:"CGI"},
    }

    i :=0
    for( i < len(employees)){
      fmt.Println("i is ",i)
      empAsBytes, _ := json.Marshal(employees[i])
      stub.PutState("Employee"+strconv.Itoa(i), empAsBytes)
      fmt.Println("Added", employees[i])
      i=i+1
    }
    logger.Info("########## StaffChain Init Done ##########")

    return shim.Success(nil)
}

func (t* staffChain) Invoke(stub shim.ChaincodeStubInterface) pp.Response{
    logger.Info("########## StaffChain Invoke ##########")

    function, args := stub.GetFunctionAndParameters()

    if function == "CreateUser"{
      return t.CreateUser(stub,args)
    }
    if function =="Query"{
      return t.Query(stub, args)
    }

    logger.Errorf("Unknown action, check the first argument, must be 'CreateUser'. But got: %v", args[0])
    return shim.Error("Invalid function name....")
}

func (t* staffChain) CreateUser(stub shim.ChaincodeStubInterface, args []string) pp.Response {
  if len(args) != 4 {
    return shim.Error("Incorrect number of arguments. Expecting 3")
  }

    var emp = Employee{Name: args[1],DOB : args[2], CurEmployer : args[3]}
    empAsBytes,_ := json.Marshal(emp)
    stub.PutState(args[0],empAsBytes)

    return shim.Success(nil)
}

func (t* staffChain) Query(stub shim.ChaincodeStubInterface, args []string) pp.Response  {
  if(len(args)!=1){
    return shim.Error("Incorrect number of arguments. Expecting 1")
  }
  empAsBytes, _ := stub.GetState(args[0])
  return shim.Success(empAsBytes)

}


func main() {

  session, err := mgo.Dial("mongodb://localhost:27017/")
  if err!=nil {
    panic(err)
  }
  defer session.Close()

  c := session.DB("mydb").C("customers")
  err = c.Insert(&Person{"Issac","+17167172300"},
                &Person{"Resh","+919745948690"})

  if err != nil{
    log.Fatal(err)
  }


  result := Person{}
  err = c.Find(bson.M{"name":"Issac"}).One(&result)
  if err!=nil {
    log.Fatal(err)
  }

  fmt.Println("Phone:",result.Phone)

  err1 := shim.Start(new(staffChain))
  if err1 != nil {
    logger.Errorf("Error starting the staffChain: %s", err1)
  }
}
