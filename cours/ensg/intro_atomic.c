#include <iostream>
#include <string>

#include <chrono>
#include <thread>
#include <vector>
#include <atomic>

using namespace std;

// ----------------------------------------------------------


void func(std::atomic_int *n,bool *wait,int K)
{
   while (*wait) {
     /* do nothing */         
   } 
   for (int i = 0; i < K ; i++) {
     (*n)++;
     // load  AX1,@n  // n = 10
     // inc   AX1     // AX = 11
     // store @n,AX1  // n = 11
     //...
     
   }   
}

int main()
{

  std::atomic_int n(0);
  
  bool wait = true;

  thread th1(func,&n,&wait,1000000);
   
  thread th2(func,&n,&wait,1000000);
  
  wait = false;

  th1.join();
  th2.join();

  cerr << "n = " << n << endl;

  return 0;
}

// ----------------------------------------------------------
