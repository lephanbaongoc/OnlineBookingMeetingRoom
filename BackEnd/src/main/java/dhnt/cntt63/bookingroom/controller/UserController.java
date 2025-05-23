package dhnt.cntt63.bookingroom.controller;

import dhnt.cntt63.bookingroom.dto.Respond;
import dhnt.cntt63.bookingroom.service.interfac.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Respond> getAllUsers(){
        Respond respond = userService.getAllUsers();
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }

    @GetMapping("/get-by-id/{userId}")
    public ResponseEntity<Respond> getUserById(@PathVariable("userId") String userId){
        Respond respond = userService.getUserById(userId);
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }

    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Respond> deleteUser(@PathVariable("userId") String userId){
        Respond respond = userService.deleteUser(userId);
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }

    @GetMapping("/get-logged-in-profile-info")
    public ResponseEntity<Respond> getLoggedInUserProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Respond respond = userService.getMyInfo(email);
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }

    @GetMapping("/get-user-bookings/{userId}")
    public ResponseEntity<Respond> getUserBookingHistory(@PathVariable("userId") String userId){
        Respond respond = userService.getUserBookingHistory(userId);
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }

    @PutMapping("/update-user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Respond> updateUser(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "name", required = false)String name,
            @RequestParam(value = "password", required = false)String password,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNummber", required = false)String phoneNumber,
            @RequestParam(value = "role", required = false)String role,
            @RequestParam(value = "deviceInfo", required = false)String deviceInfo
            ){
        Respond respond = userService.updateUser(userId, name, password, email, phoneNumber, role, deviceInfo);
        return ResponseEntity.status(respond.getStatusCode()).body(respond);
    }
}
